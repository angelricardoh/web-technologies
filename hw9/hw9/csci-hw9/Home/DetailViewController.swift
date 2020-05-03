//
//  DetailViewController.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/2/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit

class DetailViewController: UIViewController {
    var articleId:String? = nil
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        print("viewDidLoad")
        print(articleId)
    }
}
