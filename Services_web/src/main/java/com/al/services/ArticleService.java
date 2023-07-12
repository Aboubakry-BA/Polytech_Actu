package com.al.services;

import com.al.models.Article;
import com.al.repositories.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    public List<Article> listerArticles() {
        return articleRepository.findAll();
    }

    public List<Article> obtenirArticlesParCategorie(int id) {
        return articleRepository.findArticlesByCategorieId(id);
    }

    public Article ajouterArticle(Article article) {
        article.setDateCreation(new Date());
        article.setDateModification(new Date());
        return articleRepository.save(article);
    }

    public Article obtenirArticleParId(Long id) {
        return articleRepository.findById(id).orElse(null);
    }

    public Article modifierArticle(Article article, Long id) {
        Article articleExistant = articleRepository.findById(id).orElse(null);
        if (articleExistant != null) {
            articleExistant.setTitre(article.getTitre());
            articleExistant.setContenu(article.getContenu());
            articleExistant.setDateModification(new Date());
            return articleRepository.save(articleExistant);
        }
        return null;
    }

    public boolean supprimerArticle(Long id) {
        Article article = articleRepository.findById(id).orElse(null);
        if (article != null) {
            articleRepository.delete(article);
            return true;
        }
        return false;
    }
}
