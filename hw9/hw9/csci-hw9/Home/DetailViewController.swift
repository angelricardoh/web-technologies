//
//  DetailViewController.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/2/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit
import SDWebImage

class DetailViewController: UIViewController {
    var articleId:String? = nil
    var articleShareUrl:String? = nil
    let articleDetailWorker: ArticleDetailWorker = ArticleDetailWorker()
    
    @IBOutlet weak var articleImageView: UIImageView!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var sectionLabel: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var descriptionLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let BarButtonItemAppearance = UIBarButtonItem.appearance()
        BarButtonItemAppearance.setTitleTextAttributes([NSAttributedString.Key.foregroundColor: UIColor.clear], for: .normal)
        navigationController?.navigationBar.prefersLargeTitles = false
        
        guard let articleId = self.articleId else {
            let alertController = UIAlertController(title: "Logical Error", message:
                "Error passing articleId", preferredStyle: .alert)
            alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
            self.present(alertController, animated: true, completion: nil)
            return
        }
        
        articleDetailWorker.fetchArticleDetailInformation(articleId: articleId, articleCompletion:
            {(completion) in
            switch completion {
            case .success(let article):
                if let imageUrl = URL(string: article.image) {
                    self.articleImageView?.sd_setImage(with: imageUrl, placeholderImage: UIImage(named: "default_guardian"))
                }
                self.title = article.title
                self.titleLabel.text = article.title
                self.sectionLabel.text = article.section
                self.descriptionLabel.text = article.description
                self.articleShareUrl = article.shareUrl
                
                let dateFormatter = DateFormatter()
                dateFormatter.locale = Locale(identifier: "en")
                if let date = dateFormatter.date(from: article.date){
                    print(dateFormatter.string(from: date))
                } else {
                    print("There was an error decoding the string")
                }
                
                self.dateLabel.text = article.date
                self.descriptionLabel.text = article.description
                
                print(article)
            case .failure(let error):
            let alertController = UIAlertController(title: "Network Error", message:
                error.localizedDescription, preferredStyle: .alert)
            alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
            self.present(alertController, animated: true, completion: nil)
            }
        })
        
        print("viewDidLoad")
        print(articleId)
    }
    
    @IBAction func viewFullArticleTapped(_ sender: Any) {
        if let articleShareUrl = self.articleShareUrl, let url = URL(string: articleShareUrl) {
            UIApplication.shared.open(url)
         } else {
             let alertController = UIAlertController(title: "Network Error", message:
                            "shareUrl hasn't been loaded", preferredStyle: .alert)
                        alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
                        self.present(alertController, animated: true, completion: nil)
         }
    }
}
