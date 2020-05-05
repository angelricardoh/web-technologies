//
//  BookmarksViewController.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 4/19/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit

class BookmarksViewController: UICollectionViewController {

    @IBOutlet weak var nobookmarksLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        navigationController?.navigationBar.prefersLargeTitles = true
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        print(BookmarkManager.getAllObjects)
        
        if BookmarkManager.getAllObjects.count == 0 {
            nobookmarksLabel.isHidden = false
        }
    }
}
