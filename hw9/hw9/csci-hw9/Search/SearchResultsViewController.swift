//
//  SearchResultsViewController.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/3/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit

class SearchResultsViewController: UITableViewController {
    
    var search: String!
    
    class func searchResultsViewControllerForSearch(_ search: String) -> UIViewController {
        let storyboard = UIStoryboard(name: "Main", bundle: nil)

        let viewController =
            storyboard.instantiateViewController(withIdentifier: "SearchResultsController")
        
        if let searchResultsViewController = viewController as? SearchResultsViewController {
            searchResultsViewController.search = search
        }
        
        return viewController
    }
    
    override func viewDidLoad() {
    super.viewDidLoad()
    
    let BarButtonItemAppearance = UIBarButtonItem.appearance()
    BarButtonItemAppearance.setTitleTextAttributes([NSAttributedString.Key.foregroundColor: UIColor.clear], for: .normal)
    navigationController?.navigationBar.prefersLargeTitles = true
        
    print(search)
    
//    guard let articleId = self.articleId else {
//        let alertController = UIAlertController(title: "Logical Error", message:
//            "Error passing articleId", preferredStyle: .alert)
//        alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
//        self.present(alertController, animated: true, completion: nil)
//        return
//    }
//
//    articleDetailWorker.fetchArticleDetailInformation(articleId: articleId, articleCompletion:
//        {(completion) in
//        switch completion {
//        case .success(let article):
//            if let imageUrl = URL(string: article.image) {
//                self.articleImageView?.sd_setImage(with: imageUrl, placeholderImage: UIImage(named: "default_guardian"))
//            }
//            self.title = article.title
//            self.titleLabel.text = article.title
//            self.sectionLabel.text = article.section
//            self.descriptionLabel.text = article.description
//            self.articleShareUrl = article.shareUrl
//
//            let dateFormatter = DateFormatter()
//            dateFormatter.locale = Locale(identifier: "en")
//            if let date = dateFormatter.date(from: article.date){
//                print(dateFormatter.string(from: date))
//            } else {
//                print("There was an error decoding the string")
//            }
//
//            self.dateLabel.text = article.date
//            self.descriptionLabel.text = article.description
//
//            print(article)
//        case .failure(let error):
//        let alertController = UIAlertController(title: "Network Error", message:
//            error.localizedDescription, preferredStyle: .alert)
//        alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
//        self.present(alertController, animated: true, completion: nil)
//        }
//    })
    }
}
