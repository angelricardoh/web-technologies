//
//  BingAutosuggestWorker.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 5/3/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import UIKit

protocol AutosuggestWorkerInterface {
    func fetchAutoSuggestInformation(inputValue:String, autosuggestCompletion: @escaping AutosuggestResultHandler)
}

public enum AutosuggestResult {
    case success(autoSuggest: [String])
    case failure(error: Error)
}

public typealias AutosuggestResultHandler = (_ result: AutosuggestResult) -> Void

struct BingAutosuggestWorker: AutosuggestWorkerInterface {
    
    private struct Constants {
        static let fetchBingAutosuggestURLString = "https://api.cognitive.microsoft.com/bing/v7.0/suggestions?mkt=fr-FR&q="
    }
    
    func fetchAutoSuggestInformation(inputValue:String, autosuggestCompletion: @escaping AutosuggestResultHandler) {
        let manager = NetworkManager()
        let bingAutosuggestURL = URL(string: Constants.fetchBingAutosuggestURLString + inputValue)
        let headers: HTTPHeaders = [
            "Ocp-Apim-Subscription-Key": AppConstants.bingAutosuggestKey,
        ]
        guard let autosuggestURL = bingAutosuggestURL else {
            return autosuggestCompletion(.failure(error: NetworkRequestError.unknown(nil)))
        }
        manager.loadData(from: autosuggestURL, headers:headers, completionHandler: {(completion) in
            switch completion {
            case .success(let data):
                var results:[String] = [String]()
                guard let suggestionGroups = data["suggestionGroups"].array,
                    let firstSuggestionGroup = suggestionGroups.first?.dictionary,
                    let suggestions = firstSuggestionGroup["searchSuggestions"] else {
                        let error: Error
                        if let errorJson = data["error"].dictionary, let errorMessage = errorJson["message"]?.stringValue {
                            error = NetworkRequestError.api(4, ApiResultCode.freeTierExpired, errorMessage)
                        } else {
                            error = JSONParseError(title: "JSON Parsing Error", description: "Error while parsing: " + data.stringValue, code: 0)
                        }
                    autosuggestCompletion(.failure(error: error))
                    return
                }
                for suggestion in suggestions.array! {
                    let displayText = suggestion["displayText"].stringValue
                    results.append(displayText)
                }
                
                autosuggestCompletion(.success(autoSuggest: results))
                return
            case .failure(let error):
                print("%@", error)
                autosuggestCompletion(.failure(error: NetworkRequestError.unknown(nil)))
            }
        })
    }
}
