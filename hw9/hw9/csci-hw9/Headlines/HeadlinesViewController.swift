//
//  SecondViewController.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 4/19/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit
import XLPagerTabStrip

class HeadlinesViewController: ButtonBarPagerTabStripViewController {

    let purpleInspireColor = UIColor(red:0.13, green:0.03, blue:0.25, alpha:1.0)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        
        // change selected bar color
        settings.style.buttonBarBackgroundColor = .white
        settings.style.buttonBarItemBackgroundColor = .white
        settings.style.selectedBarBackgroundColor = .systemBlue
        settings.style.buttonBarItemFont = .boldSystemFont(ofSize: 20)
        settings.style.selectedBarHeight = 2.0
        settings.style.buttonBarMinimumLineSpacing = 0
        settings.style.buttonBarItemTitleColor = .systemGray
//        settings.style.buttonBarItemsShouldFillAvailiableWidth = true
        settings.style.buttonBarLeftContentInset = 0
        settings.style.buttonBarRightContentInset = 0
        
        changeCurrentIndexProgressive = { [weak self] (oldCell: ButtonBarViewCell?, newCell: ButtonBarViewCell?, progressPercentage: CGFloat, changeCurrentIndex: Bool, animated: Bool) -> Void in
            guard changeCurrentIndex == true else { return }
            oldCell?.label.textColor = .systemGray
            newCell?.label.textColor = .systemBlue
        }
        super.viewDidLoad()
    }
    
    override func viewControllers(for pagerTabStripController: PagerTabStripViewController) -> [UIViewController] {
        let worldViewController = SectionTableViewController(sectionInfo: "WORLD")
        worldViewController.section = "world"
        let businessViewController = SectionTableViewController(sectionInfo: "BUSINESS")
        businessViewController.section = "business"
        let politicsViewController = SectionTableViewController(sectionInfo: "POLITICS")
        politicsViewController.section = "politics"
        let sportsViewController = SectionTableViewController(sectionInfo: "SPORTS")
        sportsViewController.section = "spors"
        let technologyViewController = SectionTableViewController(sectionInfo: "TECHNOLOGY")
        technologyViewController.section = "technology"
        let scienceViewController = SectionTableViewController(sectionInfo: "SCIENCE")
        scienceViewController.section = "science"
        
        let childViewControllers = [worldViewController,
                                    businessViewController,
                                    politicsViewController,
                                    sportsViewController,
                                    technologyViewController,
                                    scienceViewController]
        
        return childViewControllers
    }
}

