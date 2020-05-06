//
//  WeatherWorker.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/1/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import Foundation

protocol WeatherHomeWorkerInterface {
    func fetchWeatherHomeInformation(locality: String, weatherCompletion: @escaping WeatherResultHandler)
}

public enum WeatherResult {
    case success(weather: Weather)
    case failure(error: Error)
}

public typealias WeatherResultHandler = (_ result: WeatherResult) -> Void

struct WeatherHomeWorker: WeatherHomeWorkerInterface {
    
    func weatherHomeURLString(city: String = "Los Angeles") -> String {
        let encodedCity = city.addingPercentEncoding(withAllowedCharacters:NSCharacterSet.urlQueryAllowed) ?? "Los%20Angeles"
        return "https://api.openweathermap.org/data/2.5/weather?q=" + encodedCity +
                "&units=metric&appid=" + AppConstants.openWeatherMapsKey
    }
    
    func fetchWeatherHomeInformation(locality: String, weatherCompletion: @escaping WeatherResultHandler) {
        print(locality)
        let manager = NetworkManager()
        let weatherAPIURL = URL(string: weatherHomeURLString(city: locality))
        print(weatherHomeURLString(city: locality))
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
