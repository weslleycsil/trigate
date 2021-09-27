<?php
class Database
{
    private $host = "localhost";

    private $db_name = "ufsc3d";
    private $username = "developer3";
    private $password = "developer3";
    
    private $charset = "utf8";
    public $conn;

    // get the database connection
    public function getConnection()
    {

        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=" . $this->charset, $this->username, $this->password);
            $this->conn->exec("set names " . $this->charset);
        } catch (PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
