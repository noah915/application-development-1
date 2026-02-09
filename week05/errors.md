Error handling
==============

Standard error format
---------------------
All errors return a JSON body with the same shape and an appropriate HTTP status code:

{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": null
  }
}

Examples
--------

400 Bad Request — invalid input
Response (400):
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "'price' must be a positive number",
    "details": { "field": "price" }
  }
}

404 Not Found — resource missing
Response (404):
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Product prod_999 not found",
    "details": { "resource": "product", "id": "prod_999" }
  }
}

409 Conflict — business rule violation
Response (409):
{
  "error": {
    "code": "OUT_OF_STOCK",
    "message": "Requested quantity exceeds available inventory",
    "details": { "productId": "prod_12345", "available": 1 }
  }
}
