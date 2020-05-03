//
//  NetworkManager.swift
//  csci-hw9
//
//  Created by Angel Ricardo Nieto Garcia on 4/26/20.
//  Copyright © 2020 Angel Ricardo Nieto Garcia. All rights reserved.
//

import Foundation
import Alamofire
import Alamofire_SwiftyJSON
import SwiftyJSON

public enum NetworkResult {
    case success(JSON)
    case failure(Error)
}

enum NetworkRequestError: Error {
    case api(_ status: Int, _ code: ApiResultCode, _ description: String)
    case unknown(Data?)
    case urlBuilt
}

enum ApiResultCode {
    case invalidAppId
    case recordNotFound   // just an example
    case unknown(String)
}

extension ApiResultCode {
    static func code(for string: String) -> ApiResultCode {
        switch string {
        case "invalid_app_id":   return .invalidAppId
        case "record_not_found": return .recordNotFound
        default:                 return .unknown(string)
        }
    }
}

public typealias HTTPHeaders = [String: String]

class NetworkManager {
    private let session: NetworkSession
    
    init(session: NetworkSession = URLSession.shared) {
        self.session = session
    }
    
    func loadInternalData(from url: String,
                  completionHandler: @escaping (NetworkResult) -> Void) {
        guard let url = URL(string: AppConstants.BASE_URL + ":" + AppConstants.DEFAULT_PORT + "/" + url) else {
            completionHandler(.failure(NetworkRequestError.urlBuilt))
            return
        }
        self.loadData(from: url, completionHandler: completionHandler)
    }
    
    func loadData(from url: URL,
                  headers: HTTPHeaders? = nil,
                  completionHandler: @escaping (NetworkResult) -> Void) {
        Alamofire.request(
            url,
            method: HTTPMethod.get,
            encoding: JSONEncoding.default,
            headers: headers).responseSwiftyJSON { dataResponse in
                guard dataResponse.response != nil else {
                    completionHandler(.failure(NetworkRequestError.unknown(dataResponse.data)))
                    return
                }
                completionHandler(NetworkResult.success(dataResponse.result.value!))
        }
    }
}
