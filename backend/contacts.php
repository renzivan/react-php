<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$accessToken = $data['access_token'] ?? null;

if (!$accessToken) {
    echo json_encode(['error' => 'Access token not provided']);
    exit();
}

$endpoint = 'https://api.hubapi.com/contacts/v1/lists/all/contacts/all';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $accessToken",
    'Content-Type: application/json'
]);

$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
    echo json_encode(['error' => 'Failed to fetch contacts: ' . curl_error($ch)]);
} else {
    $contacts = json_decode($response, true);
    if ($contacts && isset($contacts['contacts'])) {
        $formattedContacts = [];
        foreach ($contacts['contacts'] as $contact) {
            $formattedContact = [
                'vid' => $contact['vid'],
                'firstname' => $contact['properties']['firstname']['value'],
                'lastname' => $contact['properties']['lastname']['value'],
                'email' => $contact['identity-profiles'][0]['identities'][0]['value'],
                'lead_guid_timestamp' => $contact['identity-profiles'][0]['identities'][1]['timestamp']
            ];
            $formattedContacts[] = $formattedContact;
        }
        echo json_encode($formattedContacts);
    } else {
        echo json_encode(['error' => 'Failed to decode JSON response']);
    }
}

curl_close($ch);
?>
