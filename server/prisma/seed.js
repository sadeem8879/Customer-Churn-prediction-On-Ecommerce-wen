import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
    // await prisma.MenProduct.createMany({

    //     data: [
    //         { name: 'Puma', price: 19.00, description: 'Puma Mens Regular Polyester Performance Tee dryCELL', imageUrl: '/images/men/1.jpg' },
    //         { name: 'Nike', price: 13.90, description: 'Nike Mens Solid Regular Fit T-Shirt', imageUrl: '/images/men/3.jpg' },
    //         { name: 'Levis', price: 16.69, description: 'Levis Men Spread Collar Slim Fit Solid Shirts', imageUrl: '/images/men/4.jpg' },
    //         { name: 'DEELMO', price: 10.19, description: 'DEELMO Mens Stylish Solid Satin Casual Shirt for Men Full Sleeves| Poly Satin Silk Shirt', imageUrl: '/images/men/5.jpg' },
    //         { name: 'Ben MArtin', price: 9.99, description: 'Ben Martin Mens Regular Fit Jeans', imageUrl: '/images/men/6.jpg' },
    //         { name: 'Casio', price: 21.99, description: 'Casio G-Shock GM-110G-1A9DR Gold Ip Black & Gold Analog-Digital Dial Black Resin Strap Mens Watch Shock And 200M Water Resistant G1053', imageUrl: '/images/men/7.jpg' },
    //         { name: 'Bruton', price: 9.99, description: 'BRUTON Men Sport Shoes | Running Shoes | Casual Walking Shoes | Sneakers', imageUrl: '/images/men/8.jpg' },
    //         { name: 'Bata', price: 11.99, description: 'BRUTE Mens Faux Leather Moccasin Formal Shoes', imageUrl: '/images/men/9.jpg' },
    //         { name: 'Adidas', price: 24.99, description: 'adidas Mens Striped Regular Fit Polo Shirt', imageUrl: '/images/men/10.jpg' },
    //         { name: 'Adidas', price: 29.99, description: 'adidas Mens Basic 3-stripes Tricot Tracksuit (pack of 1)', imageUrl: '/images/men/11.jpg' },
    //         { name: 'Nike', price: 14.99, description: 'Nike Men Track Pants', imageUrl: '/images/men/12.jpg' },
    //         { name: 'Levis', price: 20.99, description: 'Levis Men Regular Fit Casual Pants', imageUrl: '/images/men/13.jpg' },
    //         { name: 'DEELOMO', price: 19.99, description: 'DEELMO Mens Cotton Blend Mandarin Collar Self One Design Full Sleeve Casual Short Kurta', imageUrl: '/images/men/14.jpg' },
    //         { name: 'Ben Martin', price: 11.99, description: 'Ben Martin Nylon Standard Length Jacket For Men || Hoodies For Men || Winter Stylish Bomber Jacket For Men| Biker Jacket For Men || Casual Jacket For Men', imageUrl: '/images/men/15.jpg' },
    //         { name: 'Bruto', price: 9.99, description: 'BRUTON Exclusive Trendy Sports Running Shoes | Casual Shoe | Sneakers for Mens & Boys', imageUrl: '/images/men/16.jpg' },
    //         { name: 'Puma', price: 19.99, description: 'FUAARK Mens Full Sleeve Compression T-Shirt - Athletic Base Layer for Fitness, Cycling, Training, Workout, Tactical Sports Wear', imageUrl: '/images/men/2.jpg' },

    //     ]
    // })

    // await prisma.WomenProduct.createMany({

    //     data: [
    //         { name: 'AUTOMET', price: 11.00, description: 'AUTOMET Womens Long Sleeve Shirts Pleated Crew Neck Casual Fall Fashion Tops Loose Fit Lightweight Girls Outfits Clothes', imageUrl: '/images/women/1.jpg' },
    //         { name: 'Dokotoo', price: 17.90, description: 'Dokotoo Womens Short Puff Sleeve Knit Tops 2025 Trendy Crewneck Striped T Shirts Casual Summer Blouses', imageUrl: '/images/women/2.jpg' },
    //         { name: 'SAMPEEL', price: 16.69, description: 'SAMPEEL V Neck Long Sleeve Shirts for Women Casual Fall Tops Lightweight Tunic Sweaters Fashion Clothes 2025', imageUrl: '/images/women/3.jpg' },
    //         { name: 'ANRABESS', price: 10.19, description: 'ANRABESS Long Sleeve Shirts for Women V Neck Casual Fall Tops Loose Fit Lightweight Sweaters Tunic Fashion 2024 Clothes', imageUrl: '/images/women/4.jpg' },
    //         { name: 'Trendy Queen Store', price: 19.99, description: 'Trendy Queen Womens Long Sleeve Shirts Crop Tops Basic Tight Slim Fit Y2K T Shirts Winter Clothes 2024', imageUrl: '/images/women/5.jpg' },
    //         { name: 'Lavaredo', price: 24.99, description: 'Womens Leather Strap Watch Dainty Elegant Womens Watches Classic Vintage Retro Square Ladies Quartz Watches Gifts Present for Her', imageUrl: '/images/women/6.jpg' },
    //         { name: 'Anne Klein', price: 9.99, description: 'Anne Klein Womens Leather Strap Watch', imageUrl: '/images/women/7.jpg' },
    //         { name: 'VredeVogel', price: 11.99, description: 'VredeVogel Womens Chanderi Modal Butti Kurta with Stretchable Leggings & Organza Dupatta Set', imageUrl: '/images/women/9.jpg' },
    //         { name: 'MUSSHOE MULES', price: 24.99, description: 'MUSSHOE Mules for Women Flats Comfortable Pointed Toe Women Mules', imageUrl: '/images/women/10.jpg' },
    //         { name: 'Adidas', price: 29.99, description: 'Amazon Essentials Womens High-Rise Straight Jean', imageUrl: '/images/women/12.jpg' },
    //         { name: 'Beaully Womens', price: 14.99, description: 'Beaully Womens Flannel Plaid Shacket Long Sleeve Button Down Shirts Jacket Coats with Side Pockets', imageUrl: '/images/women/13.jpg' },
    //         { name: 'FITORY', price: 10.99, description: 'FITORY Womens Flat Sandals Fashion Slides With Soft Leather Slippers for Summer Size 6-11', imageUrl: '/images/women/14.jpg' },
    //         { name: 'Sun Visor', price: 9.99, description: 'Sun Visor Hats Women Large Brim Summer UV Protection Beach Cap', imageUrl: '/images/women/15.jpg' },
    //         { name: 'Casio', price: 11.99, description: 'Casio MDV106 Series | Unisex Analog Watch | 200M WR | Stainless Steel Case | Resin Band | 2 Hand Analog (HR, Min, SEC) | Date Display | Screw Down Crown/Screw Down Caseback | 3 Year Battery', imageUrl: '/images/women/16.jpg' },
    //         { name: 'INZCOU', price: 9.99, description: 'INZCOU Running Shoes Lightweight Tennis Shoes Non Slip Gym Workout Shoes Breathable Mesh Walking Sneakers', imageUrl: '/images/women/17.jpg' },
    //         { name: 'Puma', price: 19.99, description: 'PUMA Womens Essentials Logo Fleece Hoodie', imageUrl: '/images/women/18.jpg' },

    //     ]
    // })

    // await prisma.kidsProduct.createMany({

    //     data: [
    //         { name: 'Mars Infiniti ', price: 11.99, description: 'Boys Casual T-shirt Shorts  (Rust_Yellow_Blue)#JustHere', imageUrl: '/images/kids/9.jpeg' },
    //         { name: 'Miss & Chief', price: 11.00, description: 'Miss & Chief Adventure Parental Handle Sturdy and Safe for Kids (Ages 2-5yrs) Tricycle  (Pink)', imageUrl: '/images/kids/1.jpeg' },
    //         { name: 'Himashu', price: 16.69, description: 'himanshu tex Kitchen Set for Kids Girl 42-Piece , Smoky, Music,Real Water Tap', imageUrl: '/images/kids/3.jpeg' },
    //         { name: 'HOOH', price: 10.19, description: 'Slip on Sneakers For Boys & Girls  (Multicolor, 2-2.5 Years)', imageUrl: '/images/kids/4.jpeg' },
    //         { name: 'TONDU', price: 9.99, description: 'TONDU Plug N Play Kids/Baby Tricycle with Parental Control and Safety Guardrail 12 T Road Cycle  (Single Speed, Blue, Rigid)', imageUrl: '/images/kids/7.jpeg' },
    //         { name: 'FixBit', price: 11.99, description: 'Digital Watch - For Boys & Girls FB-003-KDS/SPDR', imageUrl: '/images/kids/8.jpeg' },
    //         { name: 'CUTOPIES ', price: 12.99, description: 'Boys Casual T-shirt Shorts  (DARK GREY)', imageUrl: '/images/kids/10.jpeg' },
    //         { name: 'Zeydan', price: 8.99, description: 'UV Protection Sports Sunglasses (Free Size)  (For Boys & Girls, Green, Blue)', imageUrl: '/images/kids/11.jpeg' },
    //         { name: 'skylark', price: 10.99, description: 'UV Protection Retro Square Sunglasses (Free Size)  (For Boys, Black)', imageUrl: '/images/kids/12.jpeg' },
    //         { name: 'BERSACHE', price: 11.99, description: 'Lace Sneakers For Boys & Girls  (Blue, 10 - 11 Years)', imageUrl: '/images/kids/6.jpeg' },
    //         { name: 'Bullcraft', price: 8.99, description: 'Slip on Casual Boots For Boys & Girls  (Multicolor, 3-6 Month)', imageUrl: '/images/kids/5.jpeg' },
    //         { name: 'PN fashion ', price: 14.99, description: 'Girls Below Knee Festive/Wedding Dress  (Light Green, Fashion Sleeve)', imageUrl: '/images/kids/13.jpeg' },
    //         { name: 'CROCS', price: 10.99, description: 'Slip-on Clogs For Boys & Girls  (White , 7 year)', imageUrl: '/images/kids/14.jpeg' },
    //         { name: 'LCD Writing Tablet', price: 9.99, description: 'LCD Writing Tablet for Kids, Colorful Toddlers Toys Drawing Board, Educational Kid Toys, Doodle Pad Dinosaur Toys for 2 3 4 5 6 7 8 Year Old Boys Girls Birthday Party Christmas Gifts,8.5inch', imageUrl: '/images/kids/15.jpg' },
    //         { name: 'CHERUBIC', price: 11.99, description: 'CHERUBIC Toddler Backpack, Kids Travel Backpack, Waterproof Cute Small Preschool Backpack Cartoon Daycare Bag', imageUrl: '/images/kids/17.jpg' },
    //         { name: 'Geanmoki', price: 9.99, description: 'Geanmoki Kid Backpack, Baby Boys Girls Toddler Pre School Backpack Children Backpacks Bags', imageUrl: '/images/kids/18.jpg' },
    //         { name: 'TAPUJI', price: 7.90, description: 'TAPUJI Dancing Cactus Repeats What You Say,Electronic Plush Toy with Lighting,Singing Cactus Recording and Repeat Your Words for Education Toys  (Green)', imageUrl: '/images/kids/2.jpeg' },

    //     ]
    // })

    //     await prisma.AccessoriesProduct.createMany({

    //         data: [

    //             { name: 'Stacool', price: 11.00, description: 'Upgraded Car Center Console Cover,Microfiber Leather Car Armrest Cover Cushion with 2 Storage Bags,Universal Car Armrest Storage Box Car Interior Accessories for Most Vehicles (Black)', imageUrl: '/images/accessories/1.jpg' },
    //             { name: 'JBL', price: 7.90, description: 'CARDO PACKTALK EDGEPHONES MOTORCYCLE', imageUrl: '/images/accessories/2.jpg' },
    //             { name: 'BDK', price: 16.69, description: 'BDK PolyPro Car Seat Covers Full Set in Charcoal on Black  Front and Rear Split Bench for Cars, Easy to Install Cover Set, Accessories Auto Trucks Van SUV', imageUrl: '/images/accessories/3.jpg' },
    //             { name: 'LISEN ', price: 10.19, description: 'LISEN Cell Phone Stand Adjustable Phone Holer for Desk, Computer Office Desk Accessories for iPhone 16 Holder Women Kitchen Essentials Fits All Mobile Phones Switch Kindle iPads Tablet 4-10in', imageUrl: '/images/accessories/4.jpg' },
    //             { name: 'GOFOYO', price: 9.99, description: 'K21 Mobile Game Controller for PUBG/Call of Duty/Fortnite,aim Trigger Fire Buttons L1R1 Shooter Sensitive Joystick,Gamepad for 4.7-6.5 inch iPhone & Android Phone', imageUrl: '/images/accessories/5.jpg' },
    //             { name: 'M/S DSNS', price: 11.99, description: 'M/S DSNS Wall Charger Hook Mobile Phone Holder Universal Cellphone Hanging Stand Bracket Hooks Charging Dock T1310 (White Pack OF 1) Mobile Holder', imageUrl: '/images/accessories/6.jpeg' },
    //             { name: 'SAMSUNG', price: 11.99, description: 'SAMSUNG 25 W GaN 3 A Wall Charger for Mobile  (White)', imageUrl: '/images/accessories/7.jpeg' },
    //             { name: 'EVEREADY ', price: 12.99, description: 'EVEREADY Carbon Zinc AA Battery  (Pack of 24)', imageUrl: '/images/accessories/8.jpeg' },
    //             { name: 'Mi', price: 8.99, description: 'Mi USB Type C Cable 3 A 1 m TPE USBC100T  (Compatible with Mobile, Black, One Cable)', imageUrl: '/images/accessories/9.jpeg' },
    //             { name: 'Hold up', price: 8.99, description: 'Hold up Universal Stand Holder for 7"-12" IPAD , Galaxy and Any Other Types of Tablets Mobile Holder', imageUrl: '/images/accessories/10.jpeg' },
    //             { name: 'boAt', price: 8.99, description: 'boAt Stone 350 Pro w/ Dynamic RGB LEDs, 12 HRS Playback, IPX5 & TWS Feature 14 W Bluetooth Speaker  (Vibing Blue, Mono Channel)', imageUrl: '/images/accessories/11.jpeg' },
    //             { name: 'STRIFF', price: 10.99, description: 'STRIFF Gel Wrist Support Mouse pad Gaming Mouse Pad with Lycra Cloth - Nonslip Mousepad  (Black) ', imageUrl: '/images/accessories/12.jpeg' },
    //             { name: 'Logitech', price: 11.99, description: 'Logitech MK215 Mouse & Keyboard Combo, Compact Design Wireless Laptop Keyboard  (Black)', imageUrl: '/images/accessories/13.jpeg' },
    //             { name: 'SCALEBEE', price: 8.99, description: 'SCALEBEE Plastic Press and Release Earbuds Case For Apple Airpods Pro 2nd Generation  (APPLE AIRPODS PRO 2 Premium Luxury Elegant Hard PC Cover Golden Dark Blue White)', imageUrl: '/images/accessories/14.jpeg' },
    //             { name: 'SCALEBEE', price: 4.99, description: 'SCALEBEE Ear Hooks for Apple AirPods 1, 2, 3 and Pro 2 for Running, Jogging, Gym, Walking In The Ear Headphone Cushion  (Pack of 1, Yellow)', imageUrl: '/images/accessories/15.jpeg' },
    //             { name: 'RPMSD', price: 8.99, description: 'RPMSD USB Type C, Micro USB OTG Adapter  (Pack of 1)', imageUrl: '/images/accessories/16.jpeg' },
    //             { name: 'rmourPro', price: 9.99, description: 'rmourPro Edge To Edge Tempered Glass for Apple iPhone 11, Apple 11, iPhone 11, Apple iPhone XR, Apple XR, Apple iPhone XR, (OG Privacy)  (Pack of 1)', imageUrl: '/images/accessories/17.jpg' },
    //         ]
    //     })
    await prisma.CosmeticsProduct.createMany({
        data: [
            { name: 'MORNECA', price: 19.00, description: 'Professional Makeup Kit for Women Girl Full Kit with Mirror 60 Colors All in One Make up Gift Set Included Eyeshadow,Blusher,Highlighter,Compact Powder,Brow Powder,Lipstick,Glitter,Eyeliner,Mascara 01', imageUrl: '/images/cosmetics/1.jpg' },
            { name: 'BEAKEY', price: 11.90, description: 'BEAKEY Makeup Brushes Set, Professional Foundation Eyeshadow Concealer Blush Powder Bronzer Applicator, 2 Blender Sponge wit Beauty Paper Case, Valentines Day Gifts for Her', imageUrl: '/images/cosmetics/2.jpg' },
            { name: 'Tinclen', price: 6.69, description: 'Eyelash Growth Serum with Advanced Formula Eyelash Enhancing Serum for Longer Thicker and Fuller Lashes Lash Serum for Eyelash Growth Gentle & Vegan Eyelash Conditioner 0.17 Fl Oz (5mL)', imageUrl: '/images/cosmetics/3.jpg' },
            { name: 'e.l.f. ', price: 10.19, description: 'e.l.f. Glow Reviver Lip Oil, Nourishing Tinted Lip Oil For A High-shine Finish, Infused With Jojoba Oil, Vegan & Cruelty-free, Rose Envy', imageUrl: '/images/cosmetics/4.jpg' },
            { name: 'e.l.f.', price: 9.99, description: 'e.l.f. Instant Lift Brow Pencil, Dual-Sided, Precise, Fine Tip, Shapes, Defines, Fills Brows, Contours, Combs, Tames, Neutral Brown, 0.006 Oz', imageUrl: '/images/cosmetics/5.jpg' },
            { name: 'LAURA GELLER NEW YORK', price: 11.99, description: 'LAURA GELLER NEW YORK Spackle Primer - Hydrate - Super-Size 2 Fl Oz - Hyaluronic Acid Makeup Primer for Mature Skin', imageUrl: '/images/cosmetics/6.jpg' },
            { name: 'Revlon', price: 3.99, description: 'Revlon ColorStay Pencil Waterproof Eyeliner, Smudge-Proof, Eye Makeup with Built-In Sharpener, Packaging May Vary, 201 Black, 0.01 Oz', imageUrl: '/images/cosmetics/7.jpg' },
            { name: 'AOLIKOKO', price: 12.99, description: '12-Color Pro Makeup Kit for Women - Eyeshadow, Foundation, Lipstick, Blush, Brushes, Eyeliner Stamp', imageUrl: '/images/cosmetics/8.jpg' },
            { name: 'Bliss Store', price: 8.99, description: 'Bliss Bright Idea Vitamin C + Tri-Peptide Collagen Brightening Face Skincare Serum - Anti Aging, Reduces Dark Spots, Boosts Skin Elasticity - Clean - Vegan & Cruelty-Free - 1 Fl OzVisit the Bliss Store', imageUrl: '/images/cosmetics/9.jpg' },
            { name: 'e.l.f.', price: 8.99, description: 'e.l.f. SKIN Holy Hydration! Hydrated Ever After Skincare Mini Kit, Cleanser, Makeup Remover, Moisturiser & Eye Cream For Hydrating Skin, Airplane-Friendly Sizes', imageUrl: '/images/cosmetics/10.jpg' },
            { name: 'e.l.f.', price: 8.99, description: 'Skin Care Set Vitamin C cosmetics Beauty Gift Sets Skin Care Kit with Cleanser, Toner, Serum, Eye Cream, Face Cream Travel Kit for Women Teen Girls Mom Daughter Birthday TSA-friendly Sizes 5pcs', imageUrl: '/images/cosmetics/11.jpg' },
            { name: 'LUXAZA', price: 10.99, description: 'Classic 3PCS Neutral Eyeshadow Stick Makeup Set, Metallic Shimmer Matte Cream Eye Shadow Eyeliner Brightener Pencil Crayon - D1', imageUrl: '/images/cosmetics/12.jpg' },
            { name: 'EACHY', price: 11.99, description: 'EACHY Travel Makeup Bag,Large Capacity Cosmetic Bags for Women,Waterproof Portable Pouch Open Flat Toiletry Bag Make up Organizer with Divider and Handle', imageUrl: '/images/cosmetics/13.jpg' },
            { name: 'YLNALO', price: 8.99, description: 'YLNALO Blackhead Remover Mask Kit, Charcoal Peel Off Facial Mask with Brush and Pimple Extractors, Deep Cleansing for Face Nose Blackhead Pores Acne, For All Skin Types (3.5 Fl.oz)', imageUrl: '/images/cosmetics/14.jpg' },
            { name: 'Purederm', price: 4.99, description: 'Purederm Deep Purifying Yellow O2 Bubble Mask Turmeric (5 Pack) – Bubble Face Sheet Mask for Purifying & Vitalizing', imageUrl: '/images/cosmetics/15.jpg' },
           
        ]
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })