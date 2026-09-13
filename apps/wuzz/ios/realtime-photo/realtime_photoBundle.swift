//
//  realtime_photoBundle.swift
//  realtime-photo
//
//  Created by LBN on 23/11/25.
//

import WidgetKit
import SwiftUI

@main
struct realtime_photoBundle: WidgetBundle {
    var body: some Widget {
        realtime_photo()
        realtime_photoControl()
        realtime_photoLiveActivity()
    }
}
