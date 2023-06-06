require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const tf = require('@tensorflow/tfjs-node');

const {
    validateImageType,
    scanLimitter,
    multerMiddleware
} = require('./utils'); 

const server = express();
const PORT = process.env.PORT || 8080;
const URL = 'https://storage.googleapis.com/skinmate-model/model.json';


server.disable('x-powered-by');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.get('/', (req, res) => {
    res.status(200).json({
        message: 'Response successful',
        success: true,
    });
});

server.post('/scan', scanLimitter, multerMiddleware.single('file'), async (req, res, next) => {
    const file = req.file;

    if (!file) {
        return res.status(404).json({
            message: 'Error, missing file',
        });
    }

    if (!validateImageType(file)) {
        return res.status(404).json({
            message: 'Error, invalid file type',
        });
    }

    try {
        const model = await tf.loadLayersModel(URL);
        let raw = tf.fromPixels(file, 1);
        raw = tf.image.resizeBilinear(raw, [150, 150]);
        raw = tf.div(raw, 255);
        raw = raw.expandDims(0);

        const classes = model.predict(raw);
        const classesNormalized = classes.mul(1000);
        const classesRounded = classesNormalized.round();
        const classesInLevel = classesRounded.div(100).ceil();

        const categories = ['acnes', 'blackheads', 'darkspots', 'wrinkles'];
        const predictedIndex = classesInLevel.argMax();
        const predictedCategories = categories[predictedIndex];

        return res.status(200).json({
            data: {
                skinProblem: predictedCategories
            },
            message: 'Image has been scanned successfully',
            success: true,
        });
    } catch (error) {
        next(error);
    }
});

server.use((err, req, res, _next) => {
    res.status(500).json({
        message: 'Something went wrong'
    });
});

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});
