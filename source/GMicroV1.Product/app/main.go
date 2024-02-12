package main

import (
	"GMicroV1/Product/app/usecase/product"
	"GMicroV1/Product/domain"
	"database/sql"
	"log"
	"net/http"
	"time"

	"github.com/go-sql-driver/mysql"
	"github.com/rs/cors"
)

func main() {
	//Initialize database connection here
	dbConnection, err := initializeDatabaseConnection()

	if err != nil {
		log.Fatal("haizz")
		return
	}

	defer dbConnection.Close()

	//Inject connection into repository
	productRepo := domain.GetInstanceProductRepository(dbConnection)
	timeoutContext := time.Duration(30) * time.Second
	//Inject Repository into Usecase
	productUC := product.GetProductUseCaseInstance(productRepo, timeoutContext)
	//Inject Usecase into HttpHandler
	mux := http.NewServeMux()
	product.NewProductHandler(mux, productUC)
	//Config middleware,CORS,....
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := corsHandler.Handler(mux)
	//Listen and serve port 9601
	if err := http.ListenAndServe(":9601", handler); err != nil {
		log.Fatal("Failed to start the server:", err)
	}
	log.Fatal("Run ok")
}
func initializeDatabaseConnection() (*sql.DB, error) {
	username := "root"
	password := "bin123"
	host := "localhost"
	port := "3306"
	database := "gmicrov1"

	connectionString := username + ":" + password + "@tcp(" + host + ":" + port + ")/" + database
	_ = mysql.MySQLDriver{}
	dbConn, err := sql.Open(`mysql`, connectionString)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	err = dbConn.Ping()
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	return dbConn, nil
}
