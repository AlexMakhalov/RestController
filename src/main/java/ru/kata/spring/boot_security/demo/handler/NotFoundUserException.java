package ru.kata.spring.boot_security.demo.handler;

public class NotFoundUserException extends RuntimeException {
    public NotFoundUserException(String message) {
        super(message);
    }
}
