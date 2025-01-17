//
//  WeatherView.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/2/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit

class WeatherView: UIView {
    
    @IBOutlet var contentView: UIView!
    @IBOutlet weak var cityLabel: UILabel!
    @IBOutlet weak var stateLabel: UILabel!
    @IBOutlet weak var tempLabel: UILabel!
    @IBOutlet weak var summaryLabel: UILabel!
    
    @IBOutlet weak var backgroundImageView: UIImageView!
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        commonInit()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        commonInit()
    }
    
    private func commonInit() {
        Bundle.main.loadNibNamed("WeatherView", owner: self, options: nil)
        
        addSubview(contentView)

        contentView.frame = self.bounds.inset(by: UIEdgeInsets(top: 2, left: 10, bottom: 2, right: 10))
        contentView.autoresizingMask = [.flexibleHeight, . flexibleWidth]
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()

        contentView.layer.cornerRadius = 10
        contentView.layer.masksToBounds = true
    }
}
