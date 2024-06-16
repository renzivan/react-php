<?php
$client_id = '964b5ed2-cba9-46db-b696-acbe29d5a603';
$client_secret = 'e51a0a88-9774-44b7-9a44-93fd89916c14';
$redirect_uri = 'http://localhost/hubspot/oauth.php';

if (isset($_GET['code'])) {
    $auth_code = $_GET['code'];

    $url = 'https://api.hubapi.com/oauth/v1/token';
    $post_fields = [
        'grant_type' => 'authorization_code',
        'client_id' => $client_id,
        'client_secret' => $client_secret,
        'redirect_uri' => $redirect_uri,
        'code' => $auth_code,
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_fields));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    $response_data = json_decode($response, true);
    print_r($response_data);
    if (isset($response_data['access_token'])) {
        $access_token = $response_data['access_token'];

        $react_app_url = 'http://localhost:3000';
        header('Location: ' . $react_app_url . '?access_token=' . $access_token);
        exit();
    } else {
        echo 'Failed to get access token';
    }
} else {
    echo 'Authorization code not found.';
}
