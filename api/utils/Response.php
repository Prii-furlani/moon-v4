<?php

class Response {
    public static function json($status_code, $success, $message, $data = null) {
        http_response_code($status_code);
        header('Content-Type: application/json; charset=utf-8');
        
        $response = [
            'success' => $success,
            'message' => $message
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        echo json_encode($response);
        exit;
    }
}
