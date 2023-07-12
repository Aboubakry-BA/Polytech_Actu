package com.al.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Categorie")
public class Categorie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "libelle", length = 20)
    private String libelle;
}
