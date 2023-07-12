package com.al.controllers;

import com.al.models.Article;
import com.al.services.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    @Autowired
    private ArticleService articleService;

    @GetMapping
    public List<Article> listerArticles() {
        return articleService.listerArticles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> obtenirArticleParId(@PathVariable Long id) {
        Article article = articleService.obtenirArticleParId(id);
        if (article == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(article);
    }

    @GetMapping("/categories/{id}")
    public List<Article> obtenirArticlesParCategorie(@PathVariable int id) {
        return articleService.obtenirArticlesParCategorie(id);
    }

    @PostMapping
    public ResponseEntity<Article> ajouterArticle(@RequestBody Article article) {
        Article nouvelArticle = articleService.ajouterArticle(article);
        return ResponseEntity.ok(nouvelArticle);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> modifierArticle(@RequestBody Article article, @PathVariable Long id) {
        Article articleModifie = articleService.modifierArticle(article, id);
        if (articleModifie == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(articleModifie);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerArticle(@PathVariable Long id) {
        boolean supprime = articleService.supprimerArticle(id);
        if (supprime) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
