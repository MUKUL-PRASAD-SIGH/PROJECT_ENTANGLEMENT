"""
Install AI Model Dependencies for Project Astraeus
This script installs the optional AI model dependencies
"""

import subprocess
import sys
import os

def install_package(package):
    """Install a package using pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install {package}: {e}")
        return False

def main():
    print("🤖 Installing AI Model Dependencies for Project Astraeus")
    print("=" * 60)
    
    # List of AI packages to install
    ai_packages = [
        "stable-baselines3[extra]",
        "torch",
        "gymnasium",
        "tensorboard",
        "matplotlib"
    ]
    
    print("📦 Installing the following packages:")
    for package in ai_packages:
        print(f"   • {package}")
    print()
    
    # Install each package
    success_count = 0
    for package in ai_packages:
        print(f"📥 Installing {package}...")
        if install_package(package):
            print(f"✅ Successfully installed {package}")
            success_count += 1
        else:
            print(f"❌ Failed to install {package}")
        print()
    
    print("=" * 60)
    print(f"📊 Installation Summary: {success_count}/{len(ai_packages)} packages installed")
    
    if success_count == len(ai_packages):
        print("🎉 All AI dependencies installed successfully!")
        print("\n🚀 You can now:")
        print("   • Use the trained AI model for satellite scheduling")
        print("   • Run AI vs Classical performance comparisons")
        print("   • Train new models using the Colab setup")
        print("\n💡 To test the AI integration:")
        print("   1. Start the backend: python backend/api_server.py")
        print("   2. Start the frontend: cd frontend && npm start")
        print("   3. Go to Schedule page and click 'RUN AI OPTIMIZATION'")
    else:
        print("⚠️ Some packages failed to install.")
        print("The system will still work with mock AI performance data.")
        print("\n🔧 To install manually:")
        for package in ai_packages:
            print(f"   pip install {package}")
    
    print("\n📚 For more information, see:")
    print("   • README.md - Project overview")
    print("   • colab_training_setup.py - Training instructions")
    print("   • model&datareq/README.md - Model files information")

if __name__ == "__main__":
    main()