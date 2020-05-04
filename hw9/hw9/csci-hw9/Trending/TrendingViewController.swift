//
//  TrendingViewController.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 4/19/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit

class TrendingViewController: UIViewController, UITextFieldDelegate {
    
    let trendsWorker: TrendsWorker = TrendsWorker()

    override func viewDidLoad() {
        super.viewDidLoad()

        let BarButtonItemAppearance = UIBarButtonItem.appearance()
        BarButtonItemAppearance.setTitleTextAttributes([NSAttributedString.Key.foregroundColor: UIColor.clear], for: .normal)
        navigationController?.navigationBar.prefersLargeTitles = true
        title = "Headlines"
    }

    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        guard let query = textField.text else {
            let alertController = UIAlertController(title: "Logical Error", message:
                 "query text from Search Text Field could not be retrieved", preferredStyle: .alert)
             alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
             self.present(alertController, animated: true, completion: nil)
            return true
        }
        
        trendsWorker.fetchTrends(query: query, trendsCompletion: {(completion) in
            switch completion {
            case .success(let trends):
                print(trends)
            case .failure(let error):
                let alertController = UIAlertController(title: "Network Error", message:
                    error.localizedDescription, preferredStyle: .alert)
                alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
                self.present(alertController, animated: true, completion: nil)
            }
        })
        return true
    }
}
