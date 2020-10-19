<?php
class Rooms
{

    // database connection and table name
    private $conn;
    private $table_name = "rooms";
    private $relational_rooms_users = "rooms_users";

    // object properties
    private $id;
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
        $query = "SELECT rooms.name,rooms.description,rooms.page_url,rooms.room_position FROM " . $this->relational_rooms_users . " JOIN rooms ON " . $this->relational_rooms_users . ".room = rooms.room WHERE " . $this->relational_rooms_users . ".user=:user AND " . $this->relational_rooms_users . ".room=:room ORDER BY rooms.room_position ASC";

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
        $query = "SELECT room,login.nickname FROM " . $this->relational_rooms_users . " LEFT JOIN login ON " . $this->relational_rooms_users . ".user = login.id";
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
        $query = "SELECT room FROM " . $this->relational_rooms_users . " LEFT JOIN login ON " . $this->relational_rooms_users . ".user = login.id WHERE login.id=:id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(":id", $id);

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
