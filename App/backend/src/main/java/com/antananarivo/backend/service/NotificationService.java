package com.antananarivo.backend.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    // Stub: in production wire FCM or other push provider
    public void notifyStatusChange(Long reportId, String newStatus){
        System.out.println("[Notification] report " + reportId + " changed to " + newStatus);
    }
}
