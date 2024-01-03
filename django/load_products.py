import json

file_path = 'products.json'

with open(file_path, 'r', encoding='latin1') as file:
    data = file.read()

products = json.loads(data)

for product in products:
    print(product)

