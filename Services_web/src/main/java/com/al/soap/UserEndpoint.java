package com.al.soap;

import com.al.models.User;
import com.al.services.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import soap.al.com.*;

import java.util.List;
import java.util.UUID;

@Component
@Endpoint
public class UserEndpoint {

    private static final String NAMESPACE_URI = "http://com.al.soap";

    private final UserService userService;

    @Autowired
    public UserEndpoint(UserService userService) {
        this.userService = userService;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "listerUtilisateursRequest")
    @ResponsePayload
    public ListerUtilisateursResponse listerUtilisateurs(@RequestPayload ListerUtilisateursRequest request) {
        ListerUtilisateursResponse response = new ListerUtilisateursResponse();
        List<User> utilisateurs = userService.listerUtilisateurs();
        for (User utilisateur : utilisateurs) {
            soap.al.com.User soapUser = new soap.al.com.User();
            BeanUtils.copyProperties(utilisateur, soapUser, "type");
            soapUser.setType(soap.al.com.UserType.fromValue(utilisateur.getType().toString()));
            response.getUtilisateurs().add(soapUser);
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "obtenirUtilisateurParIdRequest")
    @ResponsePayload
    public ObtenirUtilisateurParIdResponse obtenirUtilisateurParId(@RequestPayload ObtenirUtilisateurParIdRequest request) {
        ObtenirUtilisateurParIdResponse response = new ObtenirUtilisateurParIdResponse();
        Long userId = request.getId();
        User utilisateur = userService.obtenirUtilisateurParId(userId);
        if (utilisateur != null) {
            soap.al.com.User soapUser = new soap.al.com.User();
            BeanUtils.copyProperties(utilisateur, soapUser, "type");
            soapUser.setType(soap.al.com.UserType.fromValue(utilisateur.getType().toString()));
            response.setUtilisateur(soapUser);
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "ajouterUtilisateurRequest")
    @ResponsePayload
    public AjouterUtilisateurResponse ajouterUtilisateur(@RequestPayload AjouterUtilisateurRequest request) {
        AjouterUtilisateurResponse response = new AjouterUtilisateurResponse();
        soap.al.com.User soapUser = request.getUtilisateur();
        User utilisateur = new User();
        BeanUtils.copyProperties(soapUser, utilisateur, "type"); // Exclure la propriété "type" de la copie
        utilisateur.setType(User.Type.valueOf(soapUser.getType().toString())); // Copier manuellement la propriété "type"
        userService.ajouterUtilisateur(utilisateur);
        response.setUtilisateur(soapUser);
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "modifierUtilisateurRequest")
    @ResponsePayload
    public ModifierUtilisateurResponse modifierUtilisateur(@RequestPayload ModifierUtilisateurRequest request) {
        ModifierUtilisateurResponse response = new ModifierUtilisateurResponse();
        soap.al.com.User soapUser = request.getUtilisateur();
        User utilisateur = new User();
        BeanUtils.copyProperties(soapUser, utilisateur, "type"); // Exclure la propriété "type" de la copie
        utilisateur.setType(User.Type.valueOf(soapUser.getType().toString()));
        User utilisateurExistant = userService.obtenirUtilisateurParId(utilisateur.getId());
        if (utilisateurExistant != null) {
            utilisateurExistant.setLogin(utilisateur.getLogin());
            utilisateurExistant.setMotDePasse(utilisateur.getMotDePasse());
            userService.modifierUtilisateur(utilisateurExistant);
            BeanUtils.copyProperties(soapUser, utilisateur, "type"); // Exclure la propriété "type" de la copie
            utilisateur.setType(User.Type.valueOf(soapUser.getType().toString()));
            response.setUtilisateur(soapUser);
        } else {
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "supprimerUtilisateurRequest")
    @ResponsePayload
    public SupprimerUtilisateurResponse supprimerUtilisateur(@RequestPayload SupprimerUtilisateurRequest request) {
        SupprimerUtilisateurResponse response = new SupprimerUtilisateurResponse();
        Long userId = request.getId();
        User utilisateur = userService.obtenirUtilisateurParId(userId);
        if (utilisateur != null) {
            soap.al.com.User soapUser = new soap.al.com.User();
            BeanUtils.copyProperties(utilisateur, soapUser, "type"); // Exclure la propriété "type" de la copie
            soapUser.setType(soap.al.com.UserType.fromValue(utilisateur.getType().toString()));
            userService.supprimerUtilisateur(utilisateur);
            response.setUtilisateur(soapUser);
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "authentifierUtilisateurRequest")
    @ResponsePayload
    public AuthentifierUtilisateurResponse authentifierUtilisateur(@RequestPayload AuthentifierUtilisateurRequest request) {
        AuthentifierUtilisateurResponse response = new AuthentifierUtilisateurResponse();
        String login = request.getLogin();
        String motDePasse = request.getMotDePasse();
        User utilisateur = userService.authentifierUtilisateur(login, motDePasse);
        if (utilisateur != null) {
            soap.al.com.User soapUser = new soap.al.com.User();
            BeanUtils.copyProperties(utilisateur, soapUser, "type", "motDePasse"); // Exclure les propriétés "type" et "motDePasse" de la copie
            soapUser.setType(soap.al.com.UserType.fromValue(utilisateur.getType().toString())); // Assurez-vous que la propriété "type" est définie correctement
            response.setUtilisateur(soapUser);
        } else {
            response.setUtilisateur(null);
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "genererTokenUtilisateurRequest")
    @ResponsePayload
    public GenererTokenUtilisateurResponse genererTokenUtilisateur(@RequestPayload GenererTokenUtilisateurRequest request) {
        GenererTokenUtilisateurResponse response = new GenererTokenUtilisateurResponse();
        Long userId = request.getId();
        User utilisateur = userService.obtenirUtilisateurParId(userId);
        if (utilisateur != null) {
            String token = genererToken();
            utilisateur.setToken(token);
            soap.al.com.User soapUser = new soap.al.com.User();
            BeanUtils.copyProperties(utilisateur, soapUser, "type"); // Exclure la propriété "type" de la copie
            soapUser.setType(soap.al.com.UserType.fromValue(utilisateur.getType().toString()));
            userService.genererTokenUtilisateur(utilisateur);
            response.setUtilisateur(soapUser);
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "supprimerTokenUtilisateurRequest")
    @ResponsePayload
    public SupprimerTokenUtilisateurResponse supprimerTokenUtilisateur(@RequestPayload SupprimerTokenUtilisateurRequest request) {
        SupprimerTokenUtilisateurResponse response = new SupprimerTokenUtilisateurResponse();
        Long userId = request.getId();
        User utilisateur = userService.obtenirUtilisateurParId(userId);
        if (utilisateur != null) {
            utilisateur.setToken(null);
            soap.al.com.User soapUser = new soap.al.com.User();
            BeanUtils.copyProperties(utilisateur, soapUser, "type"); // Exclure la propriété "type" de la copie
            soapUser.setType(soap.al.com.UserType.fromValue(utilisateur.getType().toString()));
            userService.supprimerTokenUtilisateur(utilisateur);
            response.setUtilisateur(soapUser);
        }
        return response;
    }

    private String genererToken() {
        return UUID.randomUUID().toString();
    }
}
