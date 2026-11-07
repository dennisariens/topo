import Foundation
import CoreGraphics
import ImageIO
let input = URL(fileURLWithPath: "/Users/dennisariens/.hermes/cache/scratch/hermes-nino-r2-final/chrome-native-tabbar-window.png")
let output = URL(fileURLWithPath: "/Users/dennisariens/.hermes/cache/scratch/hermes-nino-r2-final/chrome-tabbalk-ware-grootte.png")
let source = CGImageSourceCreateWithURL(input as CFURL, nil)!
let image = CGImageSourceCreateImageAtIndex(source, 0, nil)!
let cropped = image.cropping(to: CGRect(x: 0, y: 0, width: 1180, height: 90))!
let destination = CGImageDestinationCreateWithURL(output as CFURL, "public.png" as CFString, 1, nil)!
CGImageDestinationAddImage(destination, cropped, nil)
assert(CGImageDestinationFinalize(destination))
print("Native pixel crop, no resize: \(cropped.width)x\(cropped.height)")
