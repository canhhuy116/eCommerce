# Define environment variables
$env:DEV_DB_HOST = "localhost"
$env:DEV_DB_PORT = 27017
$env:DEV_DB_NAME = "eCommerceDEV"

# Run MongoDB container
docker run -d `
  --name mongodb `
  -e MONGO_INITDB_DATABASE=$env:DEV_DB_NAME `
  -p $env:DEV_DB_PORT:$env:DEV_DB_PORT `
  mongo
