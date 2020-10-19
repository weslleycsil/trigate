<?php

function createResizedBackupImage($image_name, $image_rename, $new_width, $new_height, $uploadDir, $moveToDir, $quality, $dpi)
{
    $path = $uploadDir . '/' . $image_name;
    $mime = getimagesize($path);
    if ($mime['mime'] == 'image/png') {
        $src_img = imagecreatefrompng($path);
    }
    if ($mime['mime'] == 'image/jpg' || $mime['mime'] == 'image/jpeg' || $mime['mime'] == 'image/pjpeg') {
        $src_img = imagecreatefromjpeg($path);
    }
    $old_x = imageSX($src_img);
    $old_y = imageSY($src_img);

    if ($old_x > $old_y) {
        $thumb_w = $new_width;
        $thumb_h = $old_y * ($new_height / $old_x);
    }

    if ($old_x < $old_y) {
        $thumb_w = $old_x * ($new_width / $old_y);
        $thumb_h = $new_height;
    }

    if ($old_x == $old_y) {
        $thumb_w = $new_width;
        $thumb_h = $new_height;
    }

    $dst_img = ImageCreateTrueColor($thumb_w, $thumb_h);

    imagecopyresampled($dst_img, $src_img, 0, 0, 0, 0, $thumb_w, $thumb_h, $old_x, $old_y);

    $new_thumb_loc = $moveToDir . $image_rename;
    $new_thumb_loc_webp = $moveToDir . explode(".", $image_rename)[0] . ".webp";

    if ($mime['mime'] == 'image/png' || $mime['mime'] == 'image/jpg' || $mime['mime'] == 'image/jpeg' || $mime['mime'] == 'image/pjpeg') {
        imageresolution($dst_img, $dpi);
        imagejpeg($dst_img, $new_thumb_loc, $quality);
    }

    imagedestroy($dst_img);
    imagedestroy($src_img);

    return $new_thumb_loc;
}

function createThumbnail($image_name, $image_rename, $new_width, $new_height, $uploadDir, $moveToDir, $wtrmrk_file, $quality, $dpi)
{
    $path = $uploadDir . '/' . $image_name;
    $mime = getimagesize($path);
    if ($mime['mime'] == 'image/png') {
        $src_img = imagecreatefrompng($path);
    }
    if ($mime['mime'] == 'image/jpg' || $mime['mime'] == 'image/jpeg' || $mime['mime'] == 'image/pjpeg') {
        $src_img = imagecreatefromjpeg($path);
    }
    $old_x = imageSX($src_img);
    $old_y = imageSY($src_img);

    if ($old_x > $old_y) {
        $thumb_w = $new_width;
        $thumb_h = $old_y * ($new_height / $old_x);
    }

    if ($old_x < $old_y) {
        $thumb_w = $old_x * ($new_width / $old_y);
        $thumb_h = $new_height;
    }

    if ($old_x == $old_y) {
        $thumb_w = $new_width;
        $thumb_h = $new_height;
    }

    $dst_img = ImageCreateTrueColor($thumb_w, $thumb_h);

    imagecopyresampled($dst_img, $src_img, 0, 0, 0, 0, $thumb_w, $thumb_h, $old_x, $old_y);

    $new_thumb_loc = $moveToDir . $image_rename;
    $new_thumb_loc_webp = $moveToDir . explode(".", $image_rename)[0] . ".webp";

    if ($mime['mime'] == 'image/png' || $mime['mime'] == 'image/jpg' || $mime['mime'] == 'image/jpeg' || $mime['mime'] == 'image/pjpeg') {
        $dst_img = watermark_image($dst_img, $wtrmrk_file);
        imageresolution($dst_img, $dpi);
        imagejpeg($dst_img, $new_thumb_loc, $quality);
        imagewebp($dst_img, $new_thumb_loc_webp, $quality);
    }

    imagedestroy($dst_img);
    imagedestroy($src_img);

    return $new_thumb_loc;
}

function watermark_image($target, $wtrmrk_file)
{
    $watermark = imagecreatefrompng($wtrmrk_file);
    imagealphablending($watermark, false);
    imagesavealpha($watermark, true);
    $img = $target;
    $img_w = imagesx($img);
    $img_h = imagesy($img);
    $wtrmrk_w = imagesx($watermark);
    $wtrmrk_h = imagesy($watermark);
    $dst_x = ($img_w / 2) - ($wtrmrk_w / 2);
    $dst_y = ($img_h / 2) - ($wtrmrk_h / 2);
    imagecopy($img, $watermark, $dst_x, $dst_y, 0, 0, $wtrmrk_w, $wtrmrk_h);
    return $img;
}

function register_resource($resource, $new_filename, $path)
{
    //$extension = explode("/", explode(';', $resource)[0])[1];
    $extension = "jpg";
    $new_filename = $new_filename . "." . $extension;
    $image_full_path = $path . "/" . $new_filename;
    $decoded_image = explode(',', $resource)[1];
    $decoded_image = base64_decode($decoded_image);
    file_put_contents($image_full_path, $decoded_image);
    return $new_filename;
}

function get_model_image_folder_path($model_id, $image_type, $backup)
{
    global $BACKUP_PATH, $IMAGES_PATH, $GIRL_FOLDER_PREFIX, $PROFESSIONAL_FOLDER_NAME, $AMATEUR_FOLDER_NAME, $VERTICAL_COVER_FOLDER_NAME, $VERTICAL_PARADISE_COVER_FOLDER_NAME, $HORIZONTAL_COVER_FOLDER_NAME, $VIDEO_FOLDER_NAME;
    $url_base = ($backup) ? $BACKUP_PATH . "/" : $IMAGES_PATH . "/";
    $url_base .= $GIRL_FOLDER_PREFIX . $model_id;
    switch ($image_type) {
        case "professional":
            $url_base .= "/" . $PROFESSIONAL_FOLDER_NAME;
            break;
        case "amateur":
            $url_base .= "/" . $AMATEUR_FOLDER_NAME;
            break;
        case "vertical_cover":
            $url_base .= "/" . $VERTICAL_COVER_FOLDER_NAME;
            break;
        case "vertical_paradise_cover":
            $url_base .= "/" . $VERTICAL_PARADISE_COVER_FOLDER_NAME;
            break;
        case "horizontal_cover":
            $url_base .= "/" . $HORIZONTAL_COVER_FOLDER_NAME;
            break;
        case "video":
            $url_base .= "/" . $VIDEO_FOLDER_NAME;
            break;
    }
    return $url_base;
}

function get_model_image_folder_content($model_id, $image_type, $backup)
{
    global $BACKUP_PATH, $IMAGES_PATH, $GIRL_FOLDER_PREFIX, $PROFESSIONAL_FOLDER_NAME, $AMATEUR_FOLDER_NAME, $VERTICAL_COVER_FOLDER_NAME, $VERTICAL_PARADISE_COVER_FOLDER_NAME, $HORIZONTAL_COVER_FOLDER_NAME, $VIDEO_FOLDER_NAME;
    $url_base = ($backup) ? $BACKUP_PATH . "/" : $IMAGES_PATH . "/";
    $url_base .= $GIRL_FOLDER_PREFIX . $model_id;
    switch ($image_type) {
        case "professional":
            $url_base .= "/" . $PROFESSIONAL_FOLDER_NAME;
            break;
        case "amateur":
            $url_base .= "/" . $AMATEUR_FOLDER_NAME;
            break;
        case "vertical_cover":
            $url_base .= "/" . $VERTICAL_COVER_FOLDER_NAME;
            break;
        case "vertical_paradise_cover":
            $url_base .= "/" . $VERTICAL_PARADISE_COVER_FOLDER_NAME;
            break;
        case "horizontal_cover":
            $url_base .= "/" . $HORIZONTAL_COVER_FOLDER_NAME;
            break;
        case "video":
            $url_base .= "/" . $VIDEO_FOLDER_NAME;
            break;
    }
    $content = scandir($url_base);
    $content = array_slice($content, 2);
    return $content;
}

function get_model_image_folder_complete_json($model_id, $backup)
{
    global $BACKUP_PATH, $IMAGES_PATH, $GIRL_FOLDER_PREFIX, $GIRL_FOLDER_PREFIX, $PROFESSIONAL_FOLDER, $AMATEUR_FOLDER, $VERTICAL_COVER_FOLDER, $VERTICAL_PARADISE_COVER_FOLDER, $HORIZONTAL_COVER_FOLDER, $VIDEO_FOLDER, $BASE_URL, $LOCAL_URL;
    $gallery_literal_path = (($backup) ? $BACKUP_PATH : $IMAGES_PATH) . "/" . $GIRL_FOLDER_PREFIX . $model_id;
    $names_array = [$PROFESSIONAL_FOLDER, $AMATEUR_FOLDER, $VERTICAL_COVER_FOLDER, $VERTICAL_PARADISE_COVER_FOLDER, $HORIZONTAL_COVER_FOLDER, $VIDEO_FOLDER];
    $JSON_IMAGES = array();

    foreach ($names_array as $value) {
        $folder_name = $value["name"];
        $folder_key = $value["key"];
        $folder_url = $gallery_literal_path . "/" . $folder_name;
        $folder_local_path = $LOCAL_URL . "/" . $folder_url;
        $JSON_IMAGES[$folder_key] = [];
        if (is_dir($folder_local_path)) {
            $content = scandir($folder_local_path);
            $content = array_slice($content, 2);
            foreach ($content as $image_name) {
                $full_path = $BASE_URL . $folder_url . "/" . $image_name;
                array_push($JSON_IMAGES[$folder_key], $full_path);
            }
        }
    }
    return $JSON_IMAGES;
}


function complete_delete_folder_and_files($model_id, $backup)
{
    global $BACKUP_PATH, $IMAGES_PATH, $GIRL_FOLDER_PREFIX, $GIRL_FOLDER_PREFIX, $PROFESSIONAL_FOLDER, $AMATEUR_FOLDER, $VERTICAL_COVER_FOLDER, $VERTICAL_PARADISE_COVER_FOLDER, $HORIZONTAL_COVER_FOLDER, $VIDEO_FOLDER, $BASE_URL, $LOCAL_URL;
    $gallery_literal_path = (($backup) ? $BACKUP_PATH : $IMAGES_PATH) . "/" . $GIRL_FOLDER_PREFIX . $model_id;
    
    $names_array = [$PROFESSIONAL_FOLDER, $AMATEUR_FOLDER, $VERTICAL_COVER_FOLDER, $VERTICAL_PARADISE_COVER_FOLDER, $HORIZONTAL_COVER_FOLDER, $VIDEO_FOLDER];


    foreach ($names_array as $value) {
        $folder_name = $value["name"];
        $folder_key = $value["key"];
        $folder_url = $gallery_literal_path . "/" . $folder_name;
        $folder_local_path = $LOCAL_URL . "/" . $folder_url;

        if (is_dir($folder_local_path)) {
            $content = scandir($folder_local_path);
            $content = array_slice($content, 2);
            foreach ($content as $image_name) {
                unlink($folder_local_path."/".$image_name);
            }
            rmdir($folder_local_path);
        }
    }
    rmdir($LOCAL_URL.$gallery_literal_path);
}

function save_delete_or_ignore_images($IMAGE_ARRAY,$LIMIT,$GIRL_BACKUP_GALLERY_PATH,$FOLDER_INFO)
{
    $array_size = count($IMAGE_ARRAY);
    create_dir_if_not_exists($GIRL_BACKUP_GALLERY_PATH);
    $image_counter = 0;
    for ($i = 0; ($i < $array_size && $i < $LIMIT); $i++) {
        $image_info = $IMAGE_ARRAY[$i];

        $filename = $FOLDER_INFO["name"] . "_" . $image_counter;
        $old_filename = $FOLDER_INFO["name"] . "_" . $i;

        $full_path_image = $GIRL_BACKUP_GALLERY_PATH . "/" . $filename . ".jpg";
        $full_path_old_image = $GIRL_BACKUP_GALLERY_PATH . "/" . $old_filename . ".jpg";
        
        if ($image_info == "DELETE") {
            unlink($full_path_old_image);
        } else if (strpos($image_info, "http") !== false) {
            rename($full_path_old_image, $full_path_image);
            $image_counter++;
        } else {
            $new_resource = new Newcomers_Gallery();
            $new_resource->register_original_resource($image_info, $filename, $GIRL_BACKUP_GALLERY_PATH);
            $image_counter++;
        }
    }
}
