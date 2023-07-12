package com.al.services;

import com.al.models.Categorie;
import com.al.repositories.CategorieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategorieService {

    @Autowired
    private CategorieRepository categorieRepository;

    public List<Categorie> listerCategories() {
        return categorieRepository.findAll();
    }

    public Categorie obtenirCategorieParId(Long id) {
        return categorieRepository.findById(id).orElse(null);
    }

    public Categorie ajouterCategorie(Categorie categorie) {
        return categorieRepository.save(categorie);
    }

    public Categorie modifierCategorie(Long id, Categorie categorie) {
        Categorie categorieExistante = categorieRepository.findById(id).orElse(null);
        if (categorieExistante != null) {
            categorieExistante.setLibelle(categorie.getLibelle());
            return categorieRepository.save(categorieExistante);
        }
        return null;
    }

    public Categorie supprimerCategorie(Long id) {
        Categorie categorie = categorieRepository.findById(id).orElse(null);
        if (categorie != null) {
            categorieRepository.delete(categorie);
            return categorie;
        }
        return null;
    }
}
