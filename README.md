docker ps

#MONGO
sudo docker run --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin -d mongo:4

#Mongoclient
sudo docker run --name mongoclient -p 3000:3000 --link mongodb:mongodb -d mongoclient/mongoclient

#Criando user no mongodb
sudo docker exec -it mongodb mongo --host localhost -u admin -p senhaadmin --authenticationDatabase admin --eval "db.getSiblingDB('herois').createUser({user: 'danilo', pwd:'danilo2910', roles: [{role: 'readWrite',db: 'herois'}]})"

#POSTGRES
sudo docker run --name postgres -e POSTGRES_USER=danilo -e POSTGRES_PASSWORD=danilo2910 -e POSTGRES_DB=heroes -p 5432:5432 -d postgres

#ADMINER - CLIENT POSTGRES
sudo docker run --name adminer -p 8080:8080 --link postgres:postgres -d adminer
