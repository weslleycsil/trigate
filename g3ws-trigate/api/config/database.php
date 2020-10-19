<?php
class Database
{
    private $host = "localhost";
    // private $db_name = "gener890_trigate";
    // private $username = "gener890_fbet_master";
    // private $password = "stroll_roda_presa";
    private $db_name = "trigate";
    private $username = "root";
    private $password = "";
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
