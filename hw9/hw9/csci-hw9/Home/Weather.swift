//
//  Weather.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/2/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import Foundation
import SwiftyJSON

public struct Weather: JSONable {
    var temp: Int
    var summary: String
    var image: String
    
    init?(parameter: JSON) {
        guard let main = parameter["main"].dictionary else {
            print("Error parsing main element")
            return nil
        }
        guard let temp = main["temp"]?.doubleValue else {
            print("Error parsing temp element")
            return nil
        }
        self.temp = Int(round(temp))

        guard let weatherFirstElement = parameter["weather"].arrayValue.first else {
            print("Error parsing weather element")
            return nil
        }
        self.summary = weatherFirstElement["main"].stringValue
        switch summary {
        case "Clouds":
            self.image = "cloudy_weather"
        case "Clear":
            self.image = "clear_weather"
        case "Snow":
            self.image = "snowy_weather"
        case "Rain":
            self.image = "rainy_weather"
        case "Thunderstorm":
            self.image = "thunder_weather"
        default:
            self.image = "sunny_weather"
        }
    }
}
