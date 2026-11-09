"""Layer behavior: coastal treatment must follow the land union, not borders."""
import unittest
import numpy as np
from terrain_layers import make_layers

class RenderLayers(unittest.TestCase):
    def setUp(self):
        # Two touching countries form one land mass: their shared border is not coast.
        self.layers = make_layers([[(4,4),(10,4),(10,16),(4,16)],
                                   [(10,4),(16,4),(16,16),(10,16)]], 2, (20,20))

    def test_no_white_or_shadow_on_internal_border(self):
        for name in ['coast','shadow']:
            alpha=np.asarray(self.layers[name])[:,:,3]
            self.assertEqual(int(alpha[20,20]),0)
        self.assertGreater(int(np.asarray(self.layers['coast'])[20,8,3]),128)

    def test_independently_switchable_full_frame_layers(self):
        self.assertEqual(self.layers['sea'].mode,'RGB')
        for name in ['coast','shadow']:
            self.assertEqual(self.layers[name].mode,'RGBA')
            self.assertEqual(self.layers[name].size,(40,40))
            self.assertEqual(self.layers[name].getpixel((20,20))[3],0)

    def test_rim_has_one_point_five_svg_pixel_coverage(self):
        alpha=np.asarray(self.layers['coast'])[20,:20,3]
        # Integrate antialiasing across a straight coastline at DPR2.
        self.assertAlmostEqual(float(alpha.sum())/255/2,1.5,places=2)

    def test_diagonal_coast_does_not_get_a_wider_rim(self):
        layers=make_layers([[(10,2),(18,10),(10,18),(2,10)]],2,(20,20))
        alpha=np.asarray(layers['coast'])[12,:20,3]
        width=float(alpha.sum())/255/2/np.sqrt(2)
        self.assertAlmostEqual(width,1.5,delta=.2)

    def test_coastal_sea_is_lighter_than_open_water(self):
        sea=np.asarray(self.layers['sea'],dtype=float)
        self.assertGreater(sea[20,6].mean(),sea[0,0].mean())
        self.assertGreater(np.asarray(self.layers['shadow'])[:,:,3].max(),0)

if __name__=='__main__':
    unittest.main()
