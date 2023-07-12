package com.al.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "User")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "login", length = 255)
    private String login;

    @Column(name = "motDePasse", length = 255)
    private String motDePasse;

    @Column(name = "token", columnDefinition = "TEXT")
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private Type type;

    public enum Type {
        ADMIN,
        EDITEUR
    }
}
