<?php
class Login
{

    // database connection and table name
    private $conn;
    private $table_name = "login";

    // object properties
    private $userUniqueId;
    private $nickname;
    private $username;
    private $password;
    private $email;
    private $admin;

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
                case "username":
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

    public function signin()
    {
        $query = "SELECT id, admin FROM " . $this->table_name . " WHERE username=:username AND password=:password";

        // prepare query
        $stmt = $this->conn->prepare($query);

        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->password = htmlspecialchars(strip_tags($this->password));

        // bind valuesc
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":password", $this->password);

        if ($stmt->execute()) {
            return $stmt;
        }

        return false;
    }

    public function signup()
    {
        // query to insert record
        $query = "INSERT INTO " . $this->table_name . " (nickname, username, password, id, email, admin) VALUES (:nickname, :username, :password, :id, :email, :admin)";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // bind valuesc
        $stmt->bindParam(":nickname", $this->nickname);
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":id", $this->userUniqueId);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":admin", $this->admin);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function checkUniqueness($unique_id_test)
    {
        $query = "SELECT COUNT(id) FROM " . $this->table_name . " WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id", $unique_id_test);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
