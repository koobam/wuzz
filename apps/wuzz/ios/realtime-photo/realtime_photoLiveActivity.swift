//
//  realtime_photoLiveActivity.swift
//  realtime-photo
//
//  Created by LBN on 23/11/25.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct realtime_photoAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct realtime_photoLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: realtime_photoAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension realtime_photoAttributes {
    fileprivate static var preview: realtime_photoAttributes {
        realtime_photoAttributes(name: "World")
    }
}

extension realtime_photoAttributes.ContentState {
    fileprivate static var smiley: realtime_photoAttributes.ContentState {
        realtime_photoAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: realtime_photoAttributes.ContentState {
         realtime_photoAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: realtime_photoAttributes.preview) {
   realtime_photoLiveActivity()
} contentStates: {
    realtime_photoAttributes.ContentState.smiley
    realtime_photoAttributes.ContentState.starEyes
}
