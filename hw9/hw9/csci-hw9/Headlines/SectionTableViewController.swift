//
//  SectionTableViewController.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/3/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import XLPagerTabStrip

class SectionTableViewController: ArticleTableViewController, IndicatorInfoProvider {
    
    var sectionInfo = IndicatorInfo(title: "View")
    
    init(sectionInfo: IndicatorInfo) {
        self.sectionInfo = sectionInfo
        super.init(style: .plain)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        // Something
    }
    
    func indicatorInfo(for pagerTabStripController: PagerTabStripViewController) -> IndicatorInfo {
        return sectionInfo
    }
}
