package com.al.controllers;

import com.al.models.Categorie;
import com.al.services.CategorieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api")
public class CategorieController {
    @Autowired
    private CategorieService categorieService;

    @GetMapping("/categories")
    public List<Categorie> listerCategories() {
        return categorieService.listerCategories();
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<Categorie> obtenirCategorieParId(@PathVariable Long id) {
        Categorie categorie = categorieService.obtenirCategorieParId(id);
        if (categorie == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(categorie);
    }

    @PostMapping("/categories")
    public ResponseEntity<Categorie> ajouterCategorie(@RequestBody Categorie categorie) {
        Categorie nouvelleCategorie = categorieService.ajouterCategorie(categorie);
        return ResponseEntity.ok(nouvelleCategorie);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Categorie> modifierCategorie(@PathVariable Long id, @RequestBody Categorie categorie) {
        Categorie categorieModifiee = categorieService.modifierCategorie(id, categorie);
        if (categorieModifiee == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(categorieModifiee);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Categorie> supprimerCategorie(@PathVariable Long id) {
        Categorie categorieSupprimee = categorieService.supprimerCategorie(id);
        if (categorieSupprimee == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(categorieSupprimee);
    }
}
