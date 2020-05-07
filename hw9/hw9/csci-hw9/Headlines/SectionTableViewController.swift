//
//  SectionTableViewController.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/3/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import XLPagerTabStrip
import SwiftSpinner

class SectionTableViewController: ArticleTableViewController, IndicatorInfoProvider {
    
    var indicatorInfo = IndicatorInfo(title: "View")
    var section:String? = nil
    let worker: NewsWorker = NewsWorker()
    let customRefreshControl = UIRefreshControl()
    
    init(sectionInfo: IndicatorInfo) {
        self.indicatorInfo = sectionInfo
        super.init(style: .plain)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Something
        let nib = UINib(nibName: "NewsTableViewCell", bundle: nil)
        tableView.register(nib, forCellReuseIdentifier: "newsCell")
        
        if let title = indicatorInfo.title {
            SwiftSpinner.show("Loading \(title) Headlines..")
        }
        
        guard self.section != nil else {
            let alertController = UIAlertController(title: "Logical Error", message:
                "View Controller has to have a section loaded", preferredStyle: .alert)
            alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
            self.present(alertController, animated: true, completion: nil)
            return
        }
        
        self.customRefreshControl.addTarget(self, action: #selector(refresh), for: .valueChanged)
        self.tableView.insertSubview(self.customRefreshControl, at: 0)
        
        self.refresh()
    }
    
    @objc func refresh() {
        worker.fetchNewsSectionInformation(section: self.section!, articlesCompletion: {(completion) in
            SwiftSpinner.hide()
            self.customRefreshControl.endRefreshing()
            self.refreshControl?.endRefreshing()
            switch completion {
            case .success(let articles):
                self.articles = articles
                self.tableView.reloadData()
            case .failure(let error):
                let alertController = UIAlertController(title: "Network Error", message:
                    error.localizedDescription, preferredStyle: .alert)
                alertController.addAction(UIAlertAction(title: "Dismiss", style: .default))
                self.present(alertController, animated: true, completion: nil)
            }
        })
    }
    
    func indicatorInfo(for pagerTabStripController: PagerTabStripViewController) -> IndicatorInfo {
        return indicatorInfo
    }
}
