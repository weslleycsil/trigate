<?php
class Rooms
{

    // database connection and table name
    private $conn;
    private $table_name = "trigate_rooms";
    private $relational_rooms_users = "trigate_rooms_users";

    // object properties
    private $id;
    private $socket_id;
    private $name;
    private $description;

    private $user;
    private $room;

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
                default:
                    $value = htmlspecialchars(strip_tags($value));
            }
            $this->$property = $value;
        }
    }

    public function get_room()
    {
        $query = "SELECT name,description,cover_image FROM " . $this->table_name . " WHERE id=:id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(":id", $this->id);

        if ($stmt->execute()) {
            return $stmt;
        }
        return false;
    }

    public function get_rooms()
    {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);

        if ($stmt->execute()) {
            return $stmt;
        }
        return false;
    }


    public function get_room_rooms(){
        $query = "SELECT trigate_rooms.name,trigate_rooms.description,trigate_rooms.page_url,trigate_rooms.room_position FROM " . $this->relational_rooms_users . " JOIN trigate_rooms ON " . $this->relational_rooms_users . ".room = trigate_rooms.room WHERE " . $this->relational_rooms_users . ".user=:user AND " . $this->relational_rooms_users . ".room=:room ORDER BY trigate_rooms.room_position ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(":room", $this->room);
        $stmt->bindValue(":user", $this->user);

        if ($stmt->execute()) {
            return $stmt;
        }
        echo var_dump($stmt->errorInfo());
        return false;
    }


    public function get_users_by_room()
    {
            $query = "SELECT * FROM " . $this->relational_rooms_users . " LEFT JOIN trigate_login ON " . $this->relational_rooms_users . ".user = trigate_login.id";
            $stmt = $this->conn->prepare($query);

            if ($stmt->execute()) {
                return $stmt;
            }
            return false;
    }

    public function get_users_on_room()
    {
        $query = "SELECT * FROM " . $this->relational_rooms_users . " WHERE room=:room";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(":room", $this->room);

        if ($stmt->execute()) {
            return $stmt;
        }
        return false;
    }

    public function get_user_rooms($id)
    {
        $query = "SELECT room FROM " . $this->relational_rooms_users . " LEFT JOIN trigate_login ON " . $this->relational_rooms_users . ".user = trigate_login.id WHERE trigate_login.id=:id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(":id", $id);

        if ($stmt->execute()) {
            return $stmt;
        }
        return false;
    }

    public function get_user_rooms_opensim($opesimUser)
    {
        //query buscar o opensimuser no banco de dados
        $query = "SELECT `trigate_rooms`.`socket_id` FROM " . $this->relational_rooms_users . " LEFT JOIN `trigate_login` ON " . $this->relational_rooms_users . ".user = trigate_login.id LEFT JOIN `trigate_rooms` ON `trigate_rooms`.id = `trigate_rooms_users`.room WHERE trigate_login.opensim_user=:opesimUser";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(":opesimUser", $opesimUser);

        if ($stmt->execute()) {
            return $stmt;
        }
        return false;
    }

    public function subscribe()
    {
        // query to insert record
        $query = "INSERT INTO " . $this->relational_rooms_users . " (user, room) VALUES (:user, :room)";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // bind valuesc
        $stmt->bindParam(":user", $this->user);
        $stmt->bindParam(":room", $this->room);

        if ($stmt->execute()) {
            return true;
        }
        echo var_dump($stmt->errorInfo());
        return false;
    }
}
