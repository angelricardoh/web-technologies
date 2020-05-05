//
//  Article.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 4/26/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import Foundation
import SwiftyJSON

public struct Article: Codable, Equatable, JSONable {
    var id: String
    var title: String
    var image: String
    var section: String
    var date: String
    var description: String
    var shareUrl: String
    
    init?(parameter: JSON) {
        id = parameter["id"].stringValue
        title = parameter["title"].stringValue
        image = parameter["image"].stringValue
        if image == "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png" {
            image = ""
        }
        section = parameter["section"].stringValue
        date = parameter["date"].stringValue
        description = parameter["description"].stringValue
        shareUrl = parameter["shareUrl"].stringValue
    }
}
