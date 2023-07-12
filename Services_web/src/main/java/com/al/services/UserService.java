package com.al.services;

import com.al.models.User;
import com.al.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> listerUtilisateurs() {
        return userRepository.findAll();
    }

    public User ajouterUtilisateur(User utilisateur) {
        return userRepository.save(utilisateur);
    }

    public User obtenirUtilisateurParId(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User modifierUtilisateur(User utilisateur) {
        return userRepository.save(utilisateur);
    }

    public User supprimerUtilisateur(User utilisateur) {
        userRepository.delete(utilisateur);
        return utilisateur;
    }

    public User authentifierUtilisateur(String login, String motDePasse) {
        return userRepository.findByLoginAndMotDePasse(login, motDePasse);
    }

    public User genererTokenUtilisateur(User utilisateur) {
        return userRepository.save(utilisateur);
    }
    public User supprimerTokenUtilisateur(User utilisateur) {
        return userRepository.save(utilisateur);
    }
}
