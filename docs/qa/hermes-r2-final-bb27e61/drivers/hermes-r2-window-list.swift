import Foundation
import CoreGraphics
let pids = CommandLine.arguments.dropFirst().compactMap { Int($0.trimmingCharacters(in: .whitespacesAndNewlines)) }
guard let pid = pids.last else { fputs("No numeric PID argument\n", stderr); exit(2) }
let options: CGWindowListOption = [.optionOnScreenOnly, .excludeDesktopElements]
let windows = CGWindowListCopyWindowInfo(options, kCGNullWindowID) as? [[String: Any]] ?? []
let selected = windows.filter { ($0[kCGWindowOwnerPID as String] as? Int) == pid && ($0[kCGWindowLayer as String] as? Int) == 0 }
let data = try JSONSerialization.data(withJSONObject: selected, options: [.prettyPrinted, .sortedKeys])
FileHandle.standardOutput.write(data)
