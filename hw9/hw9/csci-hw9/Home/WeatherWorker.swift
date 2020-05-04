//
//  WeatherWorker.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/1/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import Foundation

protocol WeatherHomeWorkerInterface {
    func fetchWeatherHomeInformation(weatherCompletion: @escaping WeatherResultHandler)
}

public enum WeatherResult {
    case success(weather: Weather)
    case failure(error: Error)
}

public typealias WeatherResultHandler = (_ result: WeatherResult) -> Void

struct WeatherHomeWorker: WeatherHomeWorkerInterface {
    
    private struct Constants {
        static let fetchWeatherHomeURLString = "https://api.openweathermap.org/data/2.5/weather?q=Los%20Angeles&units=metric&appid=1ed0a3e755b2479efed8d79834376a46"
    }
    
    func fetchWeatherHomeInformation(weatherCompletion: @escaping WeatherResultHandler) {
        let manager = NetworkManager()
        let weatherAPIURL = URL(string: Constants.fetchWeatherHomeURLString)
        manager.loadData(from: weatherAPIURL!, completionHandler: {(completion) in
            switch completion {
            case .success(let data):
                guard let weather: Weather = Weather(parameter: data) else {
                    let error = JSONParseError(title: "JSON Parsing Error", description: "Error while parsing: " + data.stringValue, code: 0)
                                           weatherCompletion(.failure(error: error))
                                           return
                }
                weatherCompletion(.success(weather: weather))
                return
            case .failure(let error):
                print("%@", error)
                weatherCompletion(.failure(error: NetworkRequestError.unknown(nil)))
            }
        })
    }
}
