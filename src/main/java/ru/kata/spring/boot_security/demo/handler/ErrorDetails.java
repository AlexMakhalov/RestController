package ru.kata.spring.boot_security.demo.handler;

public class ErrorDetails {
    private String message;
    public ErrorDetails() {

    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
}
