//
//  NewsCell.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 4/25/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit

class NewsTableViewCell: UITableViewCell {
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var timeAgoLabel: UILabel!
    @IBOutlet weak var sectionLabel: UILabel!
    @IBOutlet weak var bookmarkButton: UIButton!
    @IBOutlet weak var articleImageView: UIImageView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }
}
