# SkinMate Machine Learning Endpoint

> Image Facial Skin Problem Recognition API Endpoint for SkinMate

## Scan Facial Problem

* Endpoint:
    * `POST /scan`

* Request Body:
    * Make sure that you're using `Form Data` body type!

    | **Field** | **Value** | **Description** |
    |:---:|:---:|:---|
    | file | File | Image file type either`.jpg`,`.jpeg`, or`.png` |
    
* Response:
```json
{
  "data": {
    "skinProblem": "darkspot"
  },
  "message": "Image has been scanned successfully",
  "success": true
}
```
    
* Notes:
    * The response is a JSON object with a `success` field indicating the success or failure of the request.
    * The data field contains the retrieved `results`.
