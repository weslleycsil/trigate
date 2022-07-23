<?php
class Peding_Login
{

    // database connection and table name
    private $conn;
    private $table_name = "trigate_pending_login";

    // object properties
    private $id;
    private $nickname;
    private $username;
    private $password;
    private $email;
    private $secret_code;

    // constructor with $db as database connection
    public function __construct($db)
    {
        $this->conn = $db;
    }

    //// SETTERS
    public function __set($property, $value)
    {
        if (property_exists($this, $property) && (!empty($value) || $value == 0)) {
            switch ($property) {
                case "email":
                    $value = trim($value);
                    $value = stripslashes($value);
                    $value = htmlspecialchars($value);
                    break;
                case "nickname":
                case "nickname":
                    $value = htmlspecialchars(strip_tags($value));
                    $value = str_replace(' ', '', $value);
                    $value = str_replace('.', '', $value);
                    $value = str_replace(';', '', $value);
                    $value = str_replace(',', '', $value);
                    break;
                case "password":
                    if (preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $value)) {
                        $value = "";
                    }
                    break;
                case "admin":
                    if ($value == 0) {
                        $value = 0;
                    }
                    break;
                default:
                    $value = $value;
            }
            $this->$property = $value;
        }
    }

    public function register_pending_signup()
    {
        // query to insert record
        $query = "INSERT INTO " . $this->table_name . " (nickname, username, password, email, secret_code) VALUES (:nickname, :username, :password, :email, :secret_code)";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // bind valuesc
        $stmt->bindParam(":nickname", $this->nickname);
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":secret_code", $this->secret_code);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function check_avaiable()
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE secret_code=:secret_code AND password=:password AND username=:username";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":secret_code", $this->secret_code);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":username", $this->username);

        if ($stmt->execute()) {
            return $stmt;
        }

        return false;
    }

    public function discard_pending()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE secret_code=:secret_code AND password=:password AND username=:username";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":secret_code", $this->secret_code);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":username", $this->username);

        if ($stmt->execute()) {
            return $stmt;
        }

        return false;
    }
}
