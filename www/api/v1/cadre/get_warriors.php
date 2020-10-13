<?php
require_once __DIR__.'/../auth/settings.php';
require_once('../dbsettings.php');
require_once('./cadre_validator.php');
require_once('../profile/get_profile_function.php');

$input = json_decode(file_get_contents('php://input'),true);
$res=array("success"=>false,"result"=>array());

// input { class, name }
// class {-1:전체, 0: 이병, 1:일병, 2:상병, 3:병장}

try{
  if(!$cadre_flag) throw new Exception("간부만 접근할 수 있습니다");
  $sql = "SELECT user_id FROM warrior WHERE user_id != '$userInfo[user_id]' AND unit_id = $userInfo[unit_id] AND cadre_flag=0;"; //Except cadre, only shows soldiers on same unit.
  $result = mysqli_query($dbconn,$sql);
  for($i=0;$i<$result->num_rows;$i++){
    $row = mysqli_fetch_assoc($result);
    $info = $storage->getUserInfo($row['user_id']);
    $info['today_profile'] = get_profile($dbconn,$row['user_id'],null);
    array_push($res['result'], $info);
  }
  $res['success']=true;
}
catch(Exception $e){
  http_response_code(400); //bad request
  $res['message'] = $e->getMessage();
}

echo json_encode($res,JSON_UNESCAPED_UNICODE);
?>