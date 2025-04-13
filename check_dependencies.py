import pkg_resources
import sys

required_packages = [
    'flask==3.0.2',
    'Pillow==10.2.0',
    'opencv-python==4.9.0.80',
    'numpy==1.26.4',
    'Werkzeug==3.0.1'
]

def check_dependencies():
    missing = []
    for package in required_packages:
        name, version = package.split('==')
        try:
            pkg_resources.require(package)
        except pkg_resources.VersionConflict:
            missing.append(f"{name} (wrong version)")
        except pkg_resources.DistributionNotFound:
            missing.append(name)
    
    if missing:
        print("Missing or incorrect dependencies:")
        for pkg in missing:
            print(f"- {pkg}")
        sys.exit(1)
    print("All dependencies are correctly installed!")

if __name__ == "__main__":
    check_dependencies()