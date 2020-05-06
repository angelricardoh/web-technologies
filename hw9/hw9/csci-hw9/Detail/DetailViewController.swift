//
//  DetailViewController.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/2/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit
import SDWebImage
import SwiftSpinner

class DetailViewController: UIViewController {
    var articleId:String? = nil
    let articleDetailWorker: ArticleDetailWorker = ArticleDetailWorker()
    var article:Article? = nil
    @IBOutlet weak var navigationBookmarkButton: UIBarButtonItem!
    
    @IBOutlet weak var articleImageView: UIImageView!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var sectionLabel: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var descriptionLabel: UILabel!
    
    class func detailViewControllerWithArticleId(_ id: String) -> UIViewController {
        let storyboard = UIStoryboard(name: "Main", bundle: nil)

        let viewController =
            storyboard.instantiateViewController(withIdentifier: "DetailViewController")
        
        if let detailViewController = viewController as? DetailViewController {
            detailViewController.articleId = id
        }
        
        return viewController
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        navigationController?.navigationBar.prefersLargeTitles = false
        fetchArticleDetail()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        if let article = self.article, BookmarkManager.isBookmark(article: article) {
            self.navigationBookmarkButton.image = UIImage(systemName: "bookmark.fill")
        } else {
            self.navigationBookmarkButton.image = UIImage(systemName: "bookmark")
        }
    }
    
    @IBAction func bookmarkTapped(_ sender: Any) {
        guard let article = self.article else {
            let alertController = UIAlertController(title: "Logical Error", message:
                "Error passing article", preferredStyle: .alert)
            alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
            self.present(alertController, animated: true, completion: nil)
            return
        }
        
        if BookmarkManager.isBookmark(article: article) {
            BookmarkManager.removeBookmark(article: article)
            self.navigationBookmarkButton.image = UIImage(systemName: "bookmark")        } else {
            BookmarkManager.addBookmark(article: article)
            self.navigationBookmarkButton.image = UIImage(systemName: "bookmark.fill")
        }
    }
    
    @IBAction func tweetTapped(_ sender: Any) {
        guard let article = self.article else {
            let alertController = UIAlertController(title: "Share Error", message:
                "Not able to get url info to share article", preferredStyle: .alert)
            alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
            self.present(alertController, animated: true, completion: nil)
            return
        }
        let articleShareUrl = "https://twitter.com/intent/tweet?text=Check+out+this+Article!&url=" + article.shareUrl + "&hashtags=CSCI_571_NewsApp"
        if let url = URL(string: articleShareUrl) {
            UIApplication.shared.open(url)
        }
        
    }
    
    func fetchArticleDetail() {
        guard let articleId = self.articleId else {
            let alertController = UIAlertController(title: "Logical Error", message:
                "Error passing articleId", preferredStyle: .alert)
            alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
            self.present(alertController, animated: true, completion: nil)
            return
        }
        
        articleDetailWorker.fetchArticleDetailInformation(articleId: articleId, articleCompletion:
            {(completion) in
                SwiftSpinner.hide()
                switch completion {
                case .success(let article):
                    self.article = article
                    if let imageUrl = URL(string: article.image) {
                        self.articleImageView?.sd_setImage(with: imageUrl, placeholderImage: UIImage(named: "default_guardian"))
                    }
                    self.title = article.title
                    self.titleLabel.text = article.title
                    self.sectionLabel.text = article.section
                    print(article.description)
                    

                    do {
                        guard let encodedData = article.description.data(using: String.Encoding.unicode) else {
                            let alertController = UIAlertController(title: "Logical Error", message:
                                "Unable to add attribute to String", preferredStyle: .alert)
                            alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
                            self.present(alertController, animated: true, completion: nil)
                            
                            let attributedString = NSAttributedString(string: article.description)
                            self.descriptionLabel.attributedText = attributedString
                            
                            return
                        }
                        let attributedString = try NSAttributedString(
                            data:encodedData,
                            options: [.documentType: NSAttributedString.DocumentType.html],
                            documentAttributes: nil)
                        self.descriptionLabel.attributedText = attributedString
                        
                        let systemFont = UIFont.systemFont(ofSize: 16)
                        self.descriptionLabel.font = systemFont
                    } catch {
                        let alertController = UIAlertController(title: "Logical Error", message:
                            "Unable to add attribute to String", preferredStyle: .alert)
                        alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
                        self.present(alertController, animated: true, completion: nil)
                        
                        let attributedString = NSAttributedString(string: article.description)
                        self.descriptionLabel.attributedText = attributedString
                    }
                    
                    let dateFormatter = DateFormatter()
                    dateFormatter.locale = Locale(identifier: "en")
                    if let date = dateFormatter.date(from: article.date){
                        print(dateFormatter.string(from: date))
                    } else {
                        print("There was an error decoding the string")
                    }
                    
                    self.dateLabel.text = article.date
                    
                    if BookmarkManager.isBookmark(article: article) {
                        self.navigationBookmarkButton.image = UIImage(systemName: "bookmark.fill")
                    }
                    
                case .failure(let error):
                    let alertController = UIAlertController(title: "Network Error", message:
                        error.localizedDescription, preferredStyle: .alert)
                    alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
                    self.present(alertController, animated: true, completion: nil)
                }
        })
    }
    
    @IBAction func viewFullArticleTapped(_ sender: Any) {
        if let articleShareUrl = self.article?.shareUrl, let url = URL(string: articleShareUrl) {
            UIApplication.shared.open(url)
         } else {
             let alertController = UIAlertController(title: "Network Error", message:
                            "shareUrl hasn't been loaded", preferredStyle: .alert)
                        alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
                        self.present(alertController, animated: true, completion: nil)
         }
    }
}
